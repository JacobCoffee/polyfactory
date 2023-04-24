from __future__ import annotations

import random
from abc import ABC, abstractmethod
from typing import Any


class CollectionExtender(ABC):
    __types__: tuple[type, ...]

    @staticmethod
    @abstractmethod
    def _extend_type_args(type_args: tuple[Any, ...], number_of_args: int) -> tuple[Any, ...]:
        raise NotImplementedError

    @classmethod
    def _subclass_for_type(cls, annotation_alias: Any) -> type[CollectionExtender]:
        for subclass in cls.__subclasses__():
            try:
                if issubclass(annotation_alias.__origin__, subclass.__types__):
                    return subclass
            except TypeError:
                # e.g., Union, or other non-class types
                pass
        return FallbackExtender

    @classmethod
    def extend_type_args(
        cls, annotation_alias: Any, type_args: tuple[Any, ...], number_of_args: int
    ) -> tuple[Any, ...]:
        return cls._subclass_for_type(annotation_alias)._extend_type_args(type_args, number_of_args)


class TupleExtender(CollectionExtender):
    __types__ = (tuple,)

    @staticmethod
    def _extend_type_args(type_args: tuple[Any, ...], number_of_args: int) -> tuple[Any, ...]:
        if not type_args:
            return type_args
        if type_args[-1] is not ...:
            return type_args
        type_to_extend = type_args[-2]
        return type_args[:-2] + (type_to_extend,) * number_of_args


class ListExtender(CollectionExtender):
    __types__ = (list,)

    @staticmethod
    def _extend_type_args(type_args: tuple[Any, ...], number_of_args: int) -> tuple[Any, ...]:
        if not type_args:
            return type_args
        return tuple(random.choice(type_args) for _ in range(number_of_args))  # noqa: S311


class SetExtender(CollectionExtender):
    __types__ = (set, frozenset)

    @staticmethod
    def _extend_type_args(type_args: tuple[Any, ...], number_of_args: int) -> tuple[Any, ...]:
        if not type_args:
            return type_args
        return tuple(random.choice(type_args) for _ in range(number_of_args))  # noqa: S311


class FallbackExtender(CollectionExtender):
    __types__ = ()

    @staticmethod
    def _extend_type_args(type_args: tuple[Any, ...], number_of_args: int) -> tuple[Any, ...]:
        return type_args
